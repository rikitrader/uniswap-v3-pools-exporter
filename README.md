# UniswapV3 Pools Exporter 🦄

## 🌳 Структура

### 📄 Файлы

- [.gitignore](./.gitignore) - игнор для гита 🙅‍♂️
- [package.json](./package.json) - конфигурация npm 📦
- [tsconfig.json](./tsconfig.json) - конфигурация TypeScript 📜
- [abi.json](./abi.json) - ABI контрактов 🤝
- [config.json](./config.json) - конфигурация 📝
- [database.json](./database.json) - база данных 📚

### 📁 Директории

- [/dist](./dist/) - скомпилированный JavaScript
- [/src](./src/) - исходники TypeScript

## 🔎 Описание

Экспортирует пулы UniswapV3 в [**database.json**](./database.json)

При каждом запуске добавляет новые пулы в базу

---

Формат [**database.json**](./database.json)

- **last_block_number** - последний обработанный блок
- **pools** - пулы
  - **pool** - адрес пула
  - **token0** - адрес токена 0
  - **token1** - адрес токена 1
  - **fee** - комиссия
  - **decimals0** - количество знаков токена 0
  - **decimals1** - количество знаков токена 1

## ⚙️ Настройки

- [**config.json**](./config.json)
  - **rpc_urls** - список url rpc нод
  - **factory_address** - адрес смарт-контракта UniswapV3Factory
  - **batch_size** - размер батча при парсинге decimals
  - **retries** - количество попыток при ошибке обращение к RPC
  - **timeout** - перерыв между попытками в мс

## 🚀 Запуск

1. Установить пакеты

    ```bash
    npm install
    ```

2. Скомпилировать TypeScript

    ```bash
    npm run build
    ```

3. Запустить

    ```bash
    npm run start
    ```
