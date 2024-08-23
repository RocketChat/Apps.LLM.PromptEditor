<script lang="ts" setup>
defineProps<{ modelValue: string | null }>()
const emit = defineEmits(['update:modelValue'])

const options = [
    { value: 'llama3-8b', label: 'llama3-8b', icon: 'i-tabler-brand-openai' },
    { value: 'mistral-7b-v0.1', label: 'mistral-7b-v0.1', icon: 'i-tabler-brand-openai' },
]
</script>

<template>
    <div>
        <GoTypography title size="small" color="lighter" info="The model used for the text completions.">
            Model
        </GoTypography>
        <div flex gap-3>
            <GoButtonSelect
                :options="options" w-full
                :model-value="modelValue"
                @update:model-value="emit('update:modelValue', $event)"
            />
        </div>
    </div>
</template>
