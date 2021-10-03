const { DynamoDB } = require('@YourCompany/tdk');


module.exports = async () => {
    try {
        await DynamoDB.run(['DummyTable']);
    }
    catch (error) {
        console.log(error);
    }
};
