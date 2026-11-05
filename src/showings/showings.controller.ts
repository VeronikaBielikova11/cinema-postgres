import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { parseIdPipe } from '../common/parse-id.pipe.js';
import { CreateShowingDto } from './dto/create-showing.dto.js';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto.js';
import { Showing, ShowingDetails } from './entities/showing.entity.js';
import { ShowingsService } from './showings.service.js';

@ApiTags('showings')
@Controller('showings')
export class ShowingsController {
  constructor(private readonly showingsService: ShowingsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити сеанс' })
  @ApiCreatedResponse({ type: Showing, description: 'Сеанс створено' })
  @ApiBadRequestResponse({
    description:
      'Фільму або залу немає, startsAt некоректний чи в минулому, price не є цілим додатним',
  })
  create(@Body() dto: CreateShowingDto): Showing {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати розклад сеансів' })
  @ApiOkResponse({
    type: [ShowingDetails],
    description: 'Сеанси, відсортовані за часом початку, потім за id',
  })
  @ApiBadRequestResponse({ description: 'date не відповідає формату' })
  findAll(@Query() query: FindShowingsQueryDto): ShowingDetails[] {
    return this.showingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати сеанс' })
  @ApiOkResponse({ type: ShowingDetails, description: 'Сеанс' })
  @ApiNotFoundResponse({ description: 'Сеансу з таким id немає' })
  findOne(@Param('id', parseIdPipe) id: string): ShowingDetails {
    return this.showingsService.findOne(id);
  }
}
