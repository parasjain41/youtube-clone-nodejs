class ApiError extends Error{
    constructor(
        stutusCode,
        message ="Something went wrong",
        error=[],
        statck= "",

    ){ 
        super(message)
        this.stutusCode =stutusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = error


        if (statck){
            this.stack =statck

        }else{
            Error.captureStackTrace(this, this.constructor)

        }

    }
}

export {ApiError}