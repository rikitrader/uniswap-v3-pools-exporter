import { API } from './api.js'
import { Config } from './config'
import { DataBase } from './database'

export class Exporter {
    api: API
    config: Config
    database: DataBase

    constructor () {
        this.config = new Config()
        this.api = new API(this.config)
        this.database = new DataBase()
    }

    private async parse_event (event: any): Promise<any> {
        const decimals = await Promise.all(
            [
                this.api.get_decimals(event.token0),
                this.api.get_decimals(event.token1)
            ]
        )

        const result = {
            pool: event.pool,
            token0: event.token0,
            token1: event.token1,
            fee: parseInt(event.fee) / 10 ** 6,
            decimals0: decimals[0],
            decimals1: decimals[1]
        }

        return result
    }

    private async parse_events (events: any[]): Promise<any> {
        let pools: any[] = []

        const batch_size = this.config.batch_size
        let idx = 0
        console.log(idx + '/' + events.length)
        while (idx < events.length) {
            pools = pools.concat(await Promise.all(events.slice(idx, idx + batch_size).map(async (event) => {
                return await this.parse_event(event)
            })))

            idx += batch_size
            console.log(Math.min(idx, events.length) + '/' + events.length)
        }

        return pools
    }

    async export_pools (): Promise<any> {
        const last_block_number = await this.api.get_last_block_number()
        const events = await this.api.get_events(
            this.database.last_block_number,
            last_block_number
        )
        const pools = await this.parse_events(events)

        this.database.update_last_block_number(last_block_number)
        this.database.add_pools(pools)

        return pools
    }
}
