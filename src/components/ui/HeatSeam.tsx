/**
 * HEAT SEAM — costura de calor.
 *
 * Um fio fino de brasa com um halo quente logo abaixo. Marca a emenda entre
 * a hero e o conteúdo (e pode separar quaisquer duas seções no futuro) sem
 * usar uma linha dura — a transição "esquenta" em vez de cortar.
 *
 * Fica no topo do container pai (que precisa ser `relative`).
 */
export function HeatSeam() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
      {/* fio de brasa, aceso no centro e apagando nas pontas */}
      <div className="mx-auto h-px w-2/3 max-w-shell bg-gradient-to-r from-transparent via-ember to-transparent" />
      {/* halo que desce a partir do fio */}
      <div className="mx-auto -mt-px h-24 w-2/3 max-w-shell [background:radial-gradient(60%_100%_at_50%_0%,rgb(255_90_31/0.18),transparent_70%)]" />
    </div>
  );
}
