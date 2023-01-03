import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {ApiGatewayResponse} from "../../../shared/http/ApiGatewayResponse";
import {sendMessage} from "../../../shared/services/sqs/Producer";
import {WebhookPayload} from "../../models/WebhookPayload";
import {DeployRequest} from "../../models/DeployRequest";

const DEPLOY_PROJECT_QUEUE_ARN: string = process.env.DEPLOY_PROJECT_QUEUE_ARN ?? '';

async function processRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    if (event.body === null || event.body === "") {
        return ApiGatewayResponse.BadRequestResponse("The body is empty");
    }

    const payload: WebhookPayload = JSON.parse(event.body) as WebhookPayload;

    const deployRequest: DeployRequest = {
        username: payload.head_commit.author.username,
        commitID: payload.head_commit.id,
        repositoryName: payload.repository.name,
        repositoryUrl: payload.repository.url
    }
    try {
        const response = await sendMessage(DEPLOY_PROJECT_QUEUE_ARN, deployRequest);

        return ApiGatewayResponse.SuccessResponse(response);
    } catch (e) {
        //return ApiGatewayResponse.InternalErrorResponse("It was not possible create the database at this time");
        return ApiGatewayResponse.InternalErrorResponse(JSON.stringify(e));
    }
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        return await processRequest(event);
    } catch (e) {
        return ApiGatewayResponse.InternalErrorResponse("Oops, something went wrong, please try again later");
    }
};
