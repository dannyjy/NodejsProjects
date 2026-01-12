import { Pool } from "pg";

const ConnectionString = () => {
    return new Pool({
        user: "postgres",
        host: "localhost",
        database: "taskmanagerdb",
        password: "",
        port: "5432"
    })
}

export default ConnectionString;