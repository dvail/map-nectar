import { useEffect } from 'react';
import _ from 'lodash'

export default function useEffectWhenValue(fn, effectValues) {
  return useEffect(() => {
    if (effectValues.some(v => _.isNil(v))) return

    fn()
  }, effectValues);
}
