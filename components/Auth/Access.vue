<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";

const authStore = useAuthStore();

const state = reactive({
  email: undefined,
  password: undefined,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  await authStore.signIn(event.data.email, event.data.password);
}
</script>

<template>
  <div class="max-w-sm mx-auto">
    <h1 class="text-2xl text-cyan-700 text-center">Admin Access</h1>
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" color="blue" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" color="blue" />
      </UFormGroup>
      <UButton type="submit" color="blue" variant="outline"> Submit </UButton>
    </UForm>
  </div>
</template>
