import { Allotment } from "allotment";


export default function FlowTodo() {
  return (
    <div className='fa-full-content'>
      <Allotment defaultSizes={[100, 500]}>
        {/* 左侧面板 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <div />
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
        </div>
      </Allotment>
    </div>
  );
}
