export class AppError extends Error 
{
    constructor(message: string, public statusCode = 400, public title = "Algo correu mal")
    {
        super(message);
    }
}