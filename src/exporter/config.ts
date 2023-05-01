import fs from 'fs'

export class Config {
    rpc_urls: string[]
    factory_address: string
    batch_size: number
    retries: number
    timeout: number
    abi: any

    constructor () {
        this.rpc_urls = []
        this.factory_address = ''
        this.batch_size = 0
        this.retries = 0
        this.timeout = 0
        this.abi = {
            factory: [],
            token: []
        }

        this.load_config(this.read_files())
    }

    read_files (): any {
        const config = fs.readFileSync('./config.json', 'utf-8')
        const abi = fs.readFileSync('./abi.json', 'utf-8')
        return {
            config: JSON.parse(config),
            abi: JSON.parse(abi)
        }
    }

    load_config (files: any): void {
        if (files.config.rpc_urls === undefined) {
            throw new Error('Config: rpc_url undefined')
        } else {
            this.rpc_urls = files.config.rpc_urls
        }

        if (files.config.factory_address === undefined) {
            throw new Error('Config: factory_address undefined')
        } else {
            this.factory_address = files.config.factory_address
        }

        if (files.config.batch_size === undefined) {
            throw new Error('Config: batch_size undefined')
        } else {
            this.batch_size = files.config.batch_size
        }

        if (files.config.retries === undefined) {
            throw new Error('Config: retries undefined')
        } else {
            this.retries = files.config.retries
        }

        if (files.config.timeout === undefined) {
            throw new Error('Config: batch_size undefined')
        } else {
            this.timeout = files.config.timeout
        }

        if (files.abi === undefined) {
            throw new Error('Config: abi undefined')
        } else {
            if (files.abi.factory === undefined) {
                throw new Error('Config: abi undefined')
            } else {
                this.abi.factory = files.abi.factory
            }
            if (files.abi.token === undefined) {
                throw new Error('Config: abi undefined')
            } else {
                this.abi.token = files.abi.token
            }
        }
    }
}
