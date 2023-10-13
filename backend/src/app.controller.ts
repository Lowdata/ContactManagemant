import { Controller, Get,Body, Post, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  async hello(){
    return "HelloWOrld";
  }

  @Post('webhook')
  @CacheTTL(5000)
  @UseInterceptors(CacheInterceptor)
  async webhook(@Body() body: any): Promise<void> {
    try {
        
        if(body){
            this.appService.addLatestContactsToDatabase();
        }
    } catch (e) {
      console.log(e);
    }
  }
}
