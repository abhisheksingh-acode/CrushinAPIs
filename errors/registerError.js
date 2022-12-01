import StatusCodes from "http-status-codes";

class IfExist extends Error{
   constructor(message){
      super(message);
      this.statusCode = StatusCodes.BAD_REQUEST;
   }
}

class IfRequired extends Error{
   constructor(message){
      super(message)
      this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
   }
}

export {IfExist,IfRequired};