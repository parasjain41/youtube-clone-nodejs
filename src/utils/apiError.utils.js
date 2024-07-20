class ApiError extends Error{
    constructor(
        stutusCode,
        message ="Something went wrong",
        error=[],
        stack= "",
    ){ 
        super(message)
        this.stutusCode =stutusCode 
        this.data = null
        this.message = message
        this.success = false
        this.errors = error


        if (this.stack){
            this.stack =this.stack

        }else{
            Error.captureStackTrace(this, this.constructor)

        }

    }
}

export {ApiError}