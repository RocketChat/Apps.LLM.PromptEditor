import { ref, watch } from 'vue';

function syncStorageRef(storageRef) {
  const newRef = ref(storageRef.value);
  watch(newRef, (newValue) => {
    storageRef.value = newValue;
  }, { immediate: true });
  return newRef;
}

export { syncStorageRef as s };
//# sourceMappingURL=local-storage-ref-eabb4f1d.mjs.map
