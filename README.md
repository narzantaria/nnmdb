# nnmdb

Flat-file system

На этапе разработки это будет сервер Express с ESLint и псевдонимами, затем переделаем в пакет.

* модели в виде json, не нужен никакой заумный синтаксис;
* можно сделать на базе схем, но привести к общим значениям (select -> string);
* синтаксис запросов - как в MongoDB, со знаком $, скобочками и тд.
* сами запросы и операции - взять из секции SQL W3Schools и реализовать;

> yarn add cors express file-handlers promiseman

> yarn add -D --exact prettier

> yarn add -D @eslint/js @types/cors @types/eslint__js @types/express @types/node @typescript-eslint/parser dotenv eslint eslint-config-prettier eslint-plugin-unused-imports nodemon tsc-alias tsconfig-paths ts-node typescript typescript-eslint