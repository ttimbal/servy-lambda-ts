import AWS from 'aws-sdk';

function getSQSURLFromARN(arn:string):string{
    const segments:string[] = arn.split(":");
    const service:string = segments[2]
    const region:string = segments[3]
    const accountId:string = segments[4]
    const queueName:String = segments[5]
    return "https://" + service + "." + region + ".amazonaws.com/" + accountId + '/' + queueName;
}

export async function sendMessage(SQSARN:string, message: any) {
    const SQSUrl:string=getSQSURLFromARN(SQSARN);
    const payload = {
        DelaySeconds: 10,
        MessageBody: JSON.stringify(message),
        QueueUrl: SQSUrl
    }

// Initialize AWS config with valid values
    const config={
        region: process.env.AWS_REGION,
    }

    AWS.config.update(config);

// Initialize sqs instance
    const SQSInstance = new AWS.SQS();
// wrapping the call back function with a promise
    return await new Promise((resolve, reject) => {
        SQSInstance.sendMessage(payload, (err: any, data: any) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                console.log(data)
                resolve(data)
            }
        });
    })
}
