NOTICE: deprecated, please look at https://github.com/teletype-diy/signal-server instead 
 
 
# teletype-diy-server

The server-side application that facilitates peer discovery for collaborative editing sessions in [teletype-diy](https://github.com/schadomi7/teletype-diy).

## Hacking

### Dependencies

To run teletype-server locally, you'll first need to have:

- Node 7+
- PostgreSQL 9.x

### Running locally

1. Clone and bootstrap

    ```
    git clone https://github.com/schadomi7/teletype-diy-server.git
    cd teletype-server
    cp .env.example .env
    createdb teletype-server-dev
    createdb teletype-server-test
    npm install
    npm run migrate up
    ```

4. Start the server

    ```
    ./script/server
    ```

<!-- 5. Run the tests

    ```
    npm test
    ``` -->

## Deploying

I plan to provide a docker container, feel free to send me a merge-request, if you are faster.
