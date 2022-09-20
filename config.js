const env_app = process.env.APP_ENV || "local"
const env_port = process.env.PORT || "4000"

const config = {
    local: {
        NAME: "local",
        PORT: env_port,
        dbMongoString: "mongodb://127.0.0.1:27017/booking-wellnessEvent",
        SECRETJWT: "TESTLOCAL5",
        EXPHOURJWT: 4,
        CLIENT_URL: "http://localhost:3000"

    },

}

// Overwrite process.env
const envConfig = config[env_app.trim()];
console.log(envConfig);
Object.keys(envConfig).forEach((key) => {
	if (process.env[key]===undefined) {
		process.env[key] = envConfig[key];
	}
});