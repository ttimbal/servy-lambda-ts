import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {CreateDatabaseRequest} from "../../models/CreateDatabaseRequest";
import {Err} from "../../../shared/Err";
import {ApiGatewayResponse} from "../../../shared/http/ApiGatewayResponse";
//import {sendMessage} from "../../../shared/services/sqs/Sender";
import {sendMessage} from "../../../shared/services/sqs/Producer";

//const QUEUE_URL:string= process.env.QUEUE_URL??'arn:aws:sqs:us-east-1:546326832472:create-database';
const CREATE_DATABASE_QUEUE_ARN:string=process.env.CREATE_DATABASE_QUEUE_ARN??'';


function validateRequest(request: CreateDatabaseRequest): Err {
    type Activity = typeof request;
    (Object.keys(request) as Array<keyof CreateDatabaseRequest>).forEach((item)=>{
        console.log(item)
    });
/*    const headers: Array<Object> = Object.keys(Activity).map(key => {
        return { text: key, value: key }
    });*/

    Object.entries(request).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
            return `The field ${key} is empty`;
        }
    });

    return '';
}

async function processRequest(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    if (event.body === null || event.body === "") {
        return ApiGatewayResponse.BadRequestResponse("The body is empty");
    }

    const requestDB: CreateDatabaseRequest = JSON.parse(event.body) as CreateDatabaseRequest;

/*    const err: Err = validateRequest(requestDB);
    if (err !== '') {
        return ApiGatewayResponse.BadRequestResponse(err);
    }*/


    try {
        const response = await sendMessage(CREATE_DATABASE_QUEUE_ARN, requestDB);

        return ApiGatewayResponse.SuccessResponse(response);
    } catch (e) {
        //return ApiGatewayResponse.InternalErrorResponse("It was not possible create the database at this time");
        return ApiGatewayResponse.InternalErrorResponse(JSON.stringify(e));
    }
}

export const lambdaHandler = async (event: APIGatewayProxyEvent,context: Context): Promise<APIGatewayProxyResult> => {
    try {
        return processRequest(event,context);
    } catch (e) {
        return ApiGatewayResponse.InternalErrorResponse("Oops, something went wrong, please try again later");
    }
};
