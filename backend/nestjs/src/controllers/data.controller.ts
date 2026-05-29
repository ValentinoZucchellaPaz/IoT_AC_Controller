import { Controller, Get, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/models/dto/response/error-response.dto';
import { SensorHistoryResponseDto } from 'src/models/dto/response/sensor-history-response.dto';
import { SensorResponseDto } from 'src/models/dto/response/sensor-response.dto';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { ResponseProcessingService } from 'src/services/response-processing.service';

@Controller('data')
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);

  constructor(
    private readonly responseDataProcessor: ResponseProcessingService,
    // agregar retrieveDataService
  ) {}

  @Get('/data/last')
  async getLast(): Promise<SensorResponseDto | ErrorResponseDto> {
    // buscar con service el ultimo dato guardado
    // si no hay devolver 404
    // sino creo response y devuelvo
    const response = new SensorResponseDto();
    response.message = 'todo ok';
    return await new Promise((resolve) => resolve(response));
  }

  @Get('/data/history/:period')
  async getHistory(): Promise<SensorHistoryResponseDto | ErrorResponseDto> {
    // parsear param de llegada
    // si no es valido return 400
    // obtener datos historicos
    // si no hay return 404

    const dto = [new ProcessedSensorData()]; // evito error de linter, esto debe venir de la db

    const processedData =
      await this.responseDataProcessor.processIncomingData(dto);

    const response = new SensorHistoryResponseDto();
    response.data = processedData;
    response.total = processedData.samples.length;

    this.logger.log("HTTP ${'/data/history'}: ", JSON.stringify(response)); // display in console

    return response;
  }
}
