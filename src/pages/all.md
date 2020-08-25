# Anyone can view this page

<div id="here"></div>

<style>
div#here {
  width: 300px;
  height: 300px;
  animation: animate 1300ms infinite linear;
}

@media (prefers-reduced-motion) {
  div#here {
    animation: none;
  }
}

@keyframes animate {
  from {
    box-shadow: inset 0 5px 10px 5px rgba(0, 0, 0, 0.3), inset 0 0 0 0 var(--twam-red),
      inset 0 5px 10px 5px rgba(0, 0, 0, 0), inset 0 0 0 20px var(--twam-red),
      inset 0 5px 10px 25px rgba(0, 0, 0, 0.3), inset 0 0 0 40px var(--twam-red),
      inset 0 5px 10px 45px rgba(0, 0, 0, 0.3), inset 0 0 0 60px var(--twam-red),
      inset 0 5px 10px 65px rgba(0, 0, 0, 0.3), inset 0 0 0 80px var(--twam-red),
      inset 0 5px 10px 85px rgba(0, 0, 0, 0.3), inset 0 0 0 100px var(--twam-red),
      inset 0 5px 10px 105px rgba(0, 0, 0, 0.3), inset 0 0 0 120px var(--twam-red),
      inset 0 5px 10px 125px rgba(0, 0, 0, 0.3), inset 0 0 0 140px var(--twam-red),
      inset 0 5px 10px 145px rgba(0, 0, 0, 0.3), inset 0 0 0 160px var(--twam-red);
  }
  to {
    box-shadow: inset 0 5px 10px 5px rgba(0, 0, 0, 0.3), inset 0 0 0 20px var(--twam-red),
      inset 0 5px 10px 25px rgba(0, 0, 0, 0.3), inset 0 0 0 40px var(--twam-red),
      inset 0 5px 10px 45px rgba(0, 0, 0, 0.3), inset 0 0 0 60px var(--twam-red),
      inset 0 5px 10px 65px rgba(0, 0, 0, 0.3), inset 0 0 0 80px var(--twam-red),
      inset 0 5px 10px 85px rgba(0, 0, 0, 0.3), inset 0 0 0 100px var(--twam-red),
      inset 0 5px 10px 105px rgba(0, 0, 0, 0.3), inset 0 0 0 120px var(--twam-red),
      inset 0 5px 10px 125px rgba(0, 0, 0, 0.3), inset 0 0 0 140px var(--twam-red),
      inset 0 5px 10px 145px rgba(0, 0, 0, 0.3), inset 0 0 0 160px var(--twam-red),
      inset 0 5px 10px 165px rgba(0, 0, 0, 0.3), inset 0 0 0 180px var(--twam-red);
  }
}

main {
  display: grid;
  place-content: center;
}
</style>
