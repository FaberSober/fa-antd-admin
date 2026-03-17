import { GATE_APP } from '@/configs';
import { BaseApi, type Fa } from '@fa/ui';

/**
 * Log Monitoring API
 */
class LogMonitorApi extends BaseApi<any, string> {
  /**
   * List log files in tree structure
   */
  listLogFiles = (): Promise<Fa.Ret<Fa.TreeNode<any>[]>> => this.get('listLogFiles');

  /**
   * Read portions of a log file
   * @param filePath Relative path of the log file
   * @param lines Number of lines to read
   */
  readLogFile = (filePath: string, lines: number = 200): Promise<Fa.Ret<string[]>> => this.get('readLogFile', { filePath, lines });

  /**
   * Download log file
   * @param filePath Relative path
   */
  download = (filePath: string) => this.download('downloadLogFile', { filePath });
}

export default new LogMonitorApi(GATE_APP.admin, 'logApi');
