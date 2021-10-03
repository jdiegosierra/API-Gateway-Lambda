const { DynamoDB } = require('@YourCompany/tdk');


module.exports = async () => {
    try {
        await DynamoDB.stop(['DummyTable']);
    }
    catch (error) {
        console.log(error);
    }
};
