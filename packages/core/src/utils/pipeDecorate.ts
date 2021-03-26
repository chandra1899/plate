import { NodeEntry, Range } from 'slate';
import { EditableProps } from 'slate-react/dist/components/editable';
import { SlatePlugin } from '../types/SlatePlugin/SlatePlugin';
import { SPEditor } from '../types/SPEditor';

/**
 * @see {@link Decorate}.
 * Optimization: return undefined if empty list so Editable uses a memo.
 */
export const pipeDecorate = (
  editor: SPEditor,
  plugins: SlatePlugin[]
): EditableProps['decorate'] => {
  const decorates = plugins.flatMap(
    (plugin) => plugin.decorate?.(editor) ?? []
  );
  if (!decorates.length) return;

  return (entry: NodeEntry) => {
    let ranges: Range[] = [];

    const addRanges = (newRanges?: Range[]) => {
      if (newRanges?.length) ranges = [...ranges, ...newRanges];
    };

    decorates.forEach((decorate) => {
      addRanges(decorate(entry));
    });

    return ranges;
  };
};
