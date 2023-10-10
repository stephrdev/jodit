# UI Component decorator

Every UI component that inherits from the `UIElement` class must have a component decorator.
This decorator is responsible for calling `setStatus('ready')` after the `new UI()` operation.
Other decorators will only start their work when the component is ready to function.

```typescript
@component
class UIHeight extends UIElement {
	public state = {
		height: 10
	};

	@watch('state.height')
	protected onChangeHeight() {
		this.container.style.height = this.state.height + 'px';
	}
}

@component
class UIWidth extends UIHeight {
	public state = {
		height: 10,
		width: 10
	};

	@watch('state.width')
	protected onChangeWidth() {
		this.container.style.width = this.state.width + 'px';
	}

	constructor(jodit: IJodit) {
		super(jodit);
		console.log(this.componentStatus); // beforeReady
	}
}

const elm = new UIWidth(jodit);
console.log(elm.componentStatus); // ready
elm.state.width = 100;
```

By using the decorator, the component's status will be set to `ready` automatically after instantiation.
You can access the component's status using the `componentStatus` property.
However, if you prefer to manage the readiness of a component independently,
you can choose not to use the decorator.
In such cases, you can manually set the component's status using `setStatus('ready').`

```ts
class UIData extends UIElement {
	public state = {
		data: {}
	};

	@watch('state.data')
	protected onChangeWidth() {
		this.container.innerText = this.state.data.content;
	}

	@hook('ready')
	protected onReady() {
		alert("I'm ready");
	}
}

const elm = new UIData(jodit);

fetch('index.php').then(resp => {
	elm.state.data = resp.json();
	elm.setStatus('ready');
});
```

In the above example, the `UIData` component sets its status to `ready` manually after fetching data from `index.php`.
The `onReady` hook is then triggered, displaying an alert message.
You can interact with and explore the code examples in this [CodeSandbox](https://codesandbox.io/s/decorators-u2h0os?fontsize=14&hidenavigation=1&theme=dark)

<iframe src="https://codesandbox.io/embed/decorators-u2h0os?fontsize=14&hidenavigation=1&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="Decorators"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
