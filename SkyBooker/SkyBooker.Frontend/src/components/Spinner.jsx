import { s } from '../styles';

export default function Spinner() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={s.spinner} />
    </>
  );
}
