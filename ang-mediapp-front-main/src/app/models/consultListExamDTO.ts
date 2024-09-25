import { Consult } from './consult';
import { Exam } from './exam';

export interface ConsultListExamDTOI {
  consult: Consult;
  lstExam: Exam[];
}
