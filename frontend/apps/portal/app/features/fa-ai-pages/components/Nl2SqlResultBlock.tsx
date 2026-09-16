import { useMemo, useState } from 'react';
import type { Nl2SqlWorkflowOutput } from '../types';
import styles from './Nl2SqlResultBlock.module.css';

type ViewMode = 'table' | 'bar';

export function findNl2SqlOutput(executionDetails?: Record<string, unknown>): Nl2SqlWorkflowOutput[] {
  if (!executionDetails) return [];
  return Object.values(executionDetails).flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const detail = item as Record<string, unknown>;
    if (detail.type !== 'nl2sql-node' || !detail.output || typeof detail.output !== 'object') return [];
    return [{ ...(detail.output as Nl2SqlWorkflowOutput), node_id: String(detail.id ?? ''), node_title: String(detail.title ?? '') }];
  });
}

export default function Nl2SqlResultBlock({ values }: { values?: Nl2SqlWorkflowOutput[] }) {
  if (!values?.length) return null;
  return <>{values.map((value, index) => <Nl2SqlResult key={value.node_id || `${value.run_id || index}`} value={value} />)}</>;
}

function Nl2SqlResult({ value }: { value: Nl2SqlWorkflowOutput }) {
  const columns = value.columns || [];
  const rows = value.rows || [];
  const dimensions = useMemo(() => {
    const numeric = columns.filter((column) => rows.some((row) => typeof row[column.label] === 'number'));
    const category = columns.find((column) => !numeric.includes(column)) || columns[0];
    return { category, numeric: numeric[0] };
  }, [columns, rows]);
  const canChart = Boolean(dimensions.category && dimensions.numeric && rows.length);
  const [mode, setMode] = useState<ViewMode>(value?.chart_hint?.type === 'bar' && canChart ? 'bar' : 'table');
  if (value.clarification_question) {
    return (
      <div className={styles.clarification}>
        <strong>需要补充信息</strong>
        <span>{value.clarification_question}</span>
      </div>
    );
  }

  const chartRows = rows.slice(0, 12);
  const maxValue = Math.max(1, ...chartRows.map((row) => Number(row[dimensions.numeric?.label || ''] ?? 0)));

  return (
    <section className={styles.result} aria-label="AI问数结果">
      <header>
        <strong>{value.node_title ? `${value.node_title} · 结果展示` : '结果展示'}</strong>
        <div className={styles.tabs}>
          <button data-active={mode === 'table'} onClick={() => setMode('table')} type="button">
            表格
          </button>
          <button data-active={mode === 'bar'} disabled={!canChart} onClick={() => setMode('bar')} type="button">
            柱状图
          </button>
        </div>
      </header>
      {mode === 'bar' && canChart ? (
        <div className={styles.chart}>
          {chartRows.map((row, index) => {
            const valueNumber = Number(row[dimensions.numeric!.label] ?? 0);
            return (
              <div className={styles.barRow} key={`${index}-${String(row[dimensions.category!.label] ?? '')}`}>
                <span title={String(row[dimensions.category!.label] ?? '—')}>{String(row[dimensions.category!.label] ?? '—')}</span>
                <i style={{ width: `${Math.max(2, (valueNumber / maxValue) * 100)}%` }} />
                <b>{valueNumber}</b>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.tableViewport}>
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.label}>
                    {column.label}
                    {column.masked ? <small>已脱敏</small> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.label}>{row[column.label] === null || row[column.label] === undefined ? '—' : String(row[column.label])}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Math.max(1, columns.length)}>查询成功，暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <footer>
        <span>{value.row_count ?? rows.length} 行</span>
        {value.truncated ? <span className={styles.warning}>结果已截断</span> : null}
        {value.dataset_version ? <span>数据集 v{value.dataset_version}</span> : null}
      </footer>
    </section>
  );
}
