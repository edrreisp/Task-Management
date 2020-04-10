import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }
    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signUp(
        @Body() authCredentials: AuthCredentialsDto
    ) {
        await this.authService.signUp(authCredentials);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe)
    async signIn(
        @Body() authCredentials: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return await this.authService.signIn(authCredentials);
    }
}
