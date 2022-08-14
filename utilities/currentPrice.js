const axios = require("axios");

module.exports.currentPrice = async () => {
    try {

        const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=ma";
        const response = await axios.get(url);

        return {
            error: false,
            data: response.data[0].current_price
        }
    }

    catch (error) {
        return {
            error: true
        }
    }

}