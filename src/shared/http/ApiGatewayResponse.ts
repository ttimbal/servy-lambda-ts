import {APIGatewayProxyResult} from "aws-lambda";

type Header = {
    [header: string]: boolean | number | string;
}

export class ApiGatewayResponse {
    public static SuccessResponse(body: any, code?: number, header?: Header): APIGatewayProxyResult {
        return {
            statusCode: code ?? 200,
            headers: {
                ...header,
                'Content-Type':'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(body),
        };
    }

    public static BadRequestResponse(message: string, code?: number, header?: Header): APIGatewayProxyResult {
        return {
            statusCode: code ?? 400,
            headers: {
                ...header,
                'Content-Type':'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: message,
            }),
        };
    }

    public static InternalErrorResponse(message: string, code?: number, header?: Header): APIGatewayProxyResult {
        return {
            statusCode: code ?? 500,
            headers: {
                ...header,
                'Content-Type':'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: message,
            }),
        };
    }
}