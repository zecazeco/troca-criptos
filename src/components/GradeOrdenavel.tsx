import { ReactNode } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GradeOrdenavelProps {
  ids: string[];
  onReordenar: (ids: string[]) => void;
  // recebe a alça de arrastar pra colocar dentro do card
  renderItem: (id: string, alca: ReactNode) => ReactNode;
}

function ItemOrdenavel({ id, renderItem }: { id: string; renderItem: GradeOrdenavelProps['renderItem'] }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });

  const alca = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      className="alca"
      aria-label="Arrastar pra mudar a ordem (ou use espaço e as setas)"
      title="Arraste pra mudar a ordem"
      {...attributes}
      {...listeners}
    >
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
        <circle cx="3" cy="3" r="1.4" />
        <circle cx="9" cy="3" r="1.4" />
        <circle cx="3" cy="8" r="1.4" />
        <circle cx="9" cy="8" r="1.4" />
        <circle cx="3" cy="13" r="1.4" />
        <circle cx="9" cy="13" r="1.4" />
      </svg>
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      className={`ordenavel ${isDragging ? 'ordenavel--arrastando' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {renderItem(id, alca)}
    </div>
  );
}

function GradeOrdenavel({ ids, onReordenar, renderItem }: GradeOrdenavelProps) {
  const sensores = useSensors(
    // só começa a arrastar depois de mexer uns pixels, pra não atrapalhar o clique
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const aoSoltar = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const de = ids.indexOf(String(active.id));
    const para = ids.indexOf(String(over.id));
    onReordenar(arrayMove(ids, de, para));
  };

  return (
    <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div className="grade">
          {ids.map((id) => (
            <ItemOrdenavel key={id} id={id} renderItem={renderItem} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default GradeOrdenavel;
