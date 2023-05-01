import { Exporter } from './exporter'

const exporter = new Exporter()

async function main (): Promise<void> {
    await exporter.export_pools()
    exporter.database.save_file()
}

main().then(() => {
    return true
}).catch(() => {
    return false
})
