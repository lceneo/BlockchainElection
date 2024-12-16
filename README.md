Есть возможность голосовать через кошельки, сгенерированные yarn chain. Для этого надо совершить следующую последовательность действий:
1. Выйти из аккаунта ![image](https://github.com/user-attachments/assets/dcabe425-04af-457f-a0ce-d5a4dce1c686)
2. Нажать кнопку "Connect wallet" ![image](https://github.com/user-attachments/assets/759939b8-0370-44f5-9a26-6b86b08c4f6e)
3. Выбрать кошелёк <br> ![image](https://github.com/user-attachments/assets/8d600266-d0e8-4c04-9eb6-db03df8bde9d)


При подключении кошелька Metamask и множественном голосовании может возникать ошибка Internal gRPC Error из-за кеширования внутри Metamask. Для её исправления необходимо импортировать новый кошелёк, сгенерированный командой yarn chain и очистить localStorage
