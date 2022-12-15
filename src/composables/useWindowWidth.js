import { ref, computed } from "vue";

const windowWidth = ref(window.innerWidth);

window.addEventListener("resize", () => {
  windowWidth.value = window.innerWidth;
});

const isMobile = computed(() => windowWidth.value < 768);

export default function useWindowWidth() {
  return { windowWidth, isMobile };
}
