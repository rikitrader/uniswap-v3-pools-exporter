import got from 'got'
import AbiCoder from 'web3-eth-abi'
import { Config } from './config'

export class API {
    config: Config

    constructor (config: Config) {
        this.config = config
    }

    async get_last_block_number (): Promise<number> {
        let tries = 0
        while (true) {
            try {
                const rpc_url = this.config.rpc_urls[Math.floor(Math.random() * this.config.rpc_urls.length)]

                const last_block = await got.post(rpc_url, {
                    json: {
                        jsonrpc: '2.0',
                        method: 'eth_getBlockByNumber',
                        params: [
                            'latest',
                            false
                        ],
                        id: 1
                    }
                }).json()

                if ((last_block as any).result === undefined) {
                    throw Error('KeyError')
                } else if ((last_block as any).result.number === undefined) {
                    throw Error('KeyError')
                }

                return parseInt((last_block as any).result.number, 16)
            } catch (error) {
                if (tries > this.config.retries) {
                    break
                }
                tries += 1
                await new Promise(timeout => setTimeout(timeout, this.config.timeout))
            }
        }

        return 0
    }

    async get_decimals (token_address: string): Promise<number> {
        let tries = 0
        while (true) {
            try {
                const rpc_url = this.config.rpc_urls[Math.floor(Math.random() * this.config.rpc_urls.length)]
                const signature = AbiCoder.encodeFunctionSignature(this.config.abi.token.decimals)

                const decimals = await got.post(rpc_url, {
                    json: {
                        jsonrpc: '2.0',
                        method: 'eth_call',
                        params: [
                            {
                                to: token_address,
                                data: signature
                            }
                        ],
                        id: 1
                    }
                }).json()

                if ((decimals as any).result === undefined) {
                    throw Error('KeyError')
                }

                return Number(
                    AbiCoder.decodeParameters(
                        this.config.abi.token.decimals.outputs,
                        (decimals as any).result)['0']
                )
            } catch (error) {
                if (tries > this.config.retries) {
                    break
                }
                tries += 1
                await new Promise(timeout => setTimeout(timeout, this.config.timeout))
            }
        }

        return -1
    }

    async get_events (from_block: number, to_block: number): Promise<any> {
        let tries = 0
        while (true) {
            try {
                const rpc_url = this.config.rpc_urls[Math.floor(Math.random() * this.config.rpc_urls.length)]
                const signature = AbiCoder.encodeEventSignature(this.config.abi.factory.PoolCreated)

                const events = await got.post(rpc_url, {
                    json: {
                        jsonrpc: '2.0',
                        method: 'eth_getLogs',
                        params: [
                            {
                                address: this.config.factory_address,
                                topics: [signature],
                                fromBlock: '0x' + from_block.toString(16),
                                toBlock: '0x' + to_block.toString(16)
                            }
                        ],
                        id: 1
                    }
                }).json()

                if ((events as any).result === undefined) {
                    throw Error('KeyError')
                }

                return await Promise.all((events as any).result.map(async (event: any) => {
                    event.topics.shift()
                    return AbiCoder.decodeLog(
                        this.config.abi.factory.PoolCreated.inputs,
                        event.data,
                        event.topics
                    )
                }))
            } catch (error) {
                if (tries > this.config.retries) {
                    break
                }
                tries += 1
                await new Promise(timeout => setTimeout(timeout, this.config.timeout))
            }
        }

        return []
    }
}
