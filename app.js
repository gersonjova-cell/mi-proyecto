const defaults = {
  points: 2840,
  tasks: [true, true, false, false],
};

let state;
try {
  state = { ...defaults, ...JSON.parse(localStorage.getItem("luma-state") || "{}") };
} catch {
  state = { ...defaults };
}

const taskCards = [...document.querySelectorAll(".task-card")];
const toast = document.querySelector("#toast");

function save() {
  localStorage.setItem("luma-state", JSON.stringify(state));
}

function formatNumber(number) {
  return new Intl.NumberFormat("es-ES").format(number);
}

function render() {
  let earnedToday = 0;
  let completed = 0;

  taskCards.forEach((card, index) => {
    const isDone = Boolean(state.tasks[index]);
    card.classList.toggle("completed", isDone);
    card.classList.toggle("current", !isDone && state.tasks.slice(0, index).every(Boolean));
    card.querySelector(".task-check").textContent = isDone ? "✓" : "";
    if (isDone) {
      completed += 1;
      earnedToday += Number(card.dataset.points);
    }
  });

  document.querySelector("#taskCount").textContent = `${completed} de 4`;
  document.querySelector("#dailyPoints").textContent = earnedToday;
  document.querySelector("#taskProgress").style.width = `${completed * 25}%`;
  document.querySelector("#pointsValue").textContent = formatNumber(state.points);
  document.querySelector("#headerPoints").textContent = formatNumber(state.points);
}

function showToast(title, message) {
  toast.querySelector("strong").textContent = title;
  toast.querySelector("small").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

taskCards.forEach((card, index) => {
  card.querySelector(".task-check").addEventListener("click", () => {
    const wasDone = state.tasks[index];
    state.tasks[index] = !wasDone;
    state.points += (wasDone ? -1 : 1) * Number(card.dataset.points);
    save();
    render();
    showToast(
      wasDone ? "Tarea reabierta" : "¡Buen trabajo!",
      wasDone ? "Puedes completarla de nuevo cuando quieras." : `Sumaste ${card.dataset.points} puntos a tu camino.`,
    );
  });
});

function changeView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  const titles = { hoy: "Buenas noches, Marina", progreso: "Mi progreso", objetivos: "Mis objetivos", recompensas: "Recompensas", perfil: "Mi perfil" };
  document.querySelector("#pageTitle").innerHTML = `${titles[viewId]} <span>✦</span>`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => changeView(button.dataset.view));
});

const planDialog = document.querySelector("#planDialog");
document.querySelector("#managePlan").addEventListener("click", () => planDialog.showModal());
document.querySelectorAll(".close-dialog, .close-plan").forEach((button) => button.addEventListener("click", () => planDialog.close()));
document.querySelector("#notificationBtn").addEventListener("click", () => showToast("Todo al día", "No tienes notificaciones nuevas."));
document.querySelector("#newGoal").addEventListener("click", () => showToast("Próximamente", "El editor de objetivos estará disponible muy pronto."));
document.querySelector("#resetDemo").addEventListener("click", () => {
  state = { ...defaults, tasks: [...defaults.tasks] };
  save();
  render();
  showToast("Datos restablecidos", "La demo volvió a su estado inicial.");
});

render();
