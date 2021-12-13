import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";
import {AccountsService} from "../accounts/accounts.service";


export const User=createParamDecorator((data:any,ctx:ExecutionContext)=>{
    const request=GqlExecutionContext.create(ctx)
    try {
        const authHeader = request.getContext().req.headers.authorization
        return authHeader.split(' ')[1]
    } catch(e){
        console.log(e)
    }

})