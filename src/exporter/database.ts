import fs from 'fs'

export class DataBase {
    last_block_number: number
    pools: object[]

    constructor () {
        this.last_block_number = 0
        this.pools = []

        this.load_data(this.read_file())
    }

    read_file (): any {
        const file = fs.readFileSync('./database.json', 'utf-8')

        return JSON.parse(file)
    }

    load_data (file: any): void {
        if (file.last_block_number === undefined) {
            throw new Error('Database: last_block_number undefined')
        } else {
            this.last_block_number = file.last_block_number
        }

        if (file.pools === undefined) {
            throw new Error('Database: pools undefined')
        } else {
            this.pools = file.pools
        }
    }

    save_file (): void {
        const data = {
            last_block_number: this.last_block_number,
            pools: this.pools
        }
        const output = JSON.stringify(data, (key, value) => { return value }, 2)

        fs.writeFile('./database.json', output, 'utf8', () => {})
    }

    add_pools (pools: object[]): void {
        this.pools = this.pools.concat(pools)
    }

    update_last_block_number (last_block_number: number): void {
        this.last_block_number = last_block_number
    }
}
