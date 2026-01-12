import { Pool } from "pg";

const connectionString = () => {
    return new Pool({
        user: "postgres",
        host: "localhost",
        database: "injection",
        password: "",
        port: 5432,
    });
}

export { connectionString };