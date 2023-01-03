import AWS from 'aws-sdk';


function getSQSURLFromARN(arn:string):string{
    const segments:string[] = arn.split(":");
    const service:string = segments[2]
    const region:string = segments[3]
    const accountId:string = segments[4]
    const queueName:String = segments[5]
    return "https://" + service + "." + region + ".amazonaws.com/" + accountId + '/' + queueName;
}

export async function sendMessage(SQSARN:string, message: any){
    const SQSUrl:string=getSQSURLFromARN(SQSARN);

    const payload={
        DelaySeconds: 10,
        QueueUrl: SQSUrl,
        MessageBody: JSON.stringify({...message}),
        /*            MessageAttributes: {
                        AttributeNameHere: {
                            StringValue: 'Attribute Value Here',
                            DataType: 'String',
                        },
                    },*/
    }

    console.log(payload);
    AWS.config.update({region: process.env.AWS_REGION});

// Create an SQS service object
    const sqs = new AWS.SQS({apiVersion: '2012-11-05'});


    return await new Promise((resolve, reject) => {
        sqs.sendMessage(payload, (err: any, data: any) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                console.log(data)
                resolve(data)
            }
        });
    });
}