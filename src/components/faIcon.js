export default function FaIcon() {
  return {
    view: ({ attrs: { type, title, onclick } }) => (
      <span class='icon mb-2 mt-2 text-white cursor-pointer' onclick={onclick} title={title}>
        <i class={`fas fa-2x ${type}`} />
      </span>
    ),
  }
}
