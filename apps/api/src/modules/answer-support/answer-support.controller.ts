import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AnswerSupportService } from "./answer-support.service";
import { PronunciationCheckDto, SaveNoteDto, TranslateDto } from "./dto/answer-support.dto";

const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

/** `:idOrSlug` = numeric question id or slug. */
@Controller("questions")
@UseGuards(JwtAuthGuard)
export class QuestionSupportController {
  constructor(private readonly answerSupportService: AnswerSupportService) {}

  @Get(":idOrSlug/support")
  support(@CurrentUser() user: { userId: string }, @Param("idOrSlug") idOrSlug: string) {
    return this.answerSupportService.getSupport(user.userId, idOrSlug);
  }

  /** "Ghi chú – tạo câu mẫu của riêng bạn": creates or replaces my note. */
  @Put(":idOrSlug/note")
  saveNote(@CurrentUser() user: { userId: string }, @Param("idOrSlug") idOrSlug: string, @Body() dto: SaveNoteDto) {
    return this.answerSupportService.saveNote(user.userId, idOrSlug, dto.body);
  }

  @Delete(":idOrSlug/note")
  @HttpCode(204)
  deleteNote(@CurrentUser() user: { userId: string }, @Param("idOrSlug") idOrSlug: string) {
    return this.answerSupportService.deleteNote(user.userId, idOrSlug);
  }
}

@Controller()
@UseGuards(JwtAuthGuard)
export class AnswerToolsController {
  constructor(private readonly answerSupportService: AnswerSupportService) {}

  /** "Bôi đen cụm từ bất kỳ để dịch": `translation` is null when nothing can translate it yet. */
  @Post("translations")
  translate(@Body() dto: TranslateDto) {
    return this.answerSupportService.translate(dto.text);
  }

  /** "Luyện phát âm": multipart `file` (the recording) + `text` (what the learner tried to say). Audio is not stored. */
  @Post("pronunciation-checks")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: MAX_AUDIO_BYTES } }))
  checkPronunciation(@UploadedFile() file: Express.Multer.File | undefined, @Body() dto: PronunciationCheckDto) {
    return this.answerSupportService.checkPronunciation(file, dto.text);
  }
}
