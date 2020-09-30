### 一、手势滑动基本流程

![Image text](https://raw.githubusercontent.com/leonwa/Frontend-02-Template/master/pics/week14_gesture_controlflow.jpg)

### 二、手势组件的构成如图

![Image text](https://raw.githubusercontent.com/leonwa/Frontend-02-Template/master/pics/gesure_construction.jpg)

### 三、组件细分说明

#### 1. Listener (依赖终端环境)

##### 负责对终端（例如 PC 端浏览器/移动端浏览器/其他终端环境）中元素的原生事件监听，并维护手势实现所需数据构成的统一上下文，将该上下文传给对应的 Recognizer 方法

#### 2. Recognizer

##### 结合 Listener 传入的统一的上下文，通过对坐标的计算得出当前的手势状态并维护到上下文中。并通过 dispatch 向外部传递不同状态的组件事件。

#### 3. Dispatcher (依赖终端环境)

##### 接受 Recognizer 传递的事件数据，并对具体的终端构建事件通知。

### 四、思路总结

#### 将于终端环境无关的手势计算部分抽离出，就是 Recognizer。好处是，用 listener 负责输入，dispatcher 负责输出这两个部分隔离了终端环境依赖，Recognizer 专注于手势算法的实现。如果需要支持多终端，在基本算法不变的情况下，只需要更换 listener 和 dispatcher 就可以了，最大限度地保证了组件的泛用性。
