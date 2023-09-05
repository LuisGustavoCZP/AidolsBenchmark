import Express from "express";
import router from "./routes";
import configs from "./configs";

const app = Express();

app.use(Express.urlencoded({ limit: configs.bodyLimit, extended: true }));
app.use(Express.json({limit: configs.bodyLimit}));

app.use(router);

app.listen(3000, () => 
{
    console.log("Test server initiated at http://localhost:3000")
});