<script>
  let class_name = '';
  export { class_name as class };

  console.log('class_name ::', class_name);
</script>

<!-- HTML Markup -->
<div class="inner--{class_name}">
  <div class="max-width">
    <section class="segment {class_name}">
        <slot></slot>
    </section>
  </div>
</div>

<!-- Styles  -->
<style>
.segment {
  background: 'pink';
  border: 'none';
}

/*.main {
  height: 100vh;
  display: flex;
  flex-flow: column;
  background-color: var(--color-dark-blue);
  padding-top: 15vh;
  padding-bottom: 15vh;
}*/

.indigo {
  display: flex;
  flex-flow: column;
  background-color: white;
  padding-top: 35vh;
  padding-bottom: 15vh;
  height: auto;
  color: #800080;
  text-align: left;
  font-weight: bold;
  font-size: var(--fluid-type);
}

.indigo > h2, h3, p {
  margin: 0;
  padding: 0;
  width: auto;
}

.indigo > p:nth-child(2) {
  margin-bottom: 1.5em;
}

.navy {
  height: 100vh;
  display: flex;
  flex-flow: column;
  background-color: var(--color-dark-blue);
  padding-top: 15vh;
  padding-bottom: 15vh;
  height: auto;
  flex-flow: column nowrap;
  align-items: flex-end;
  justify-content: center;
  background-color: var(--color-navy);
  color: white;
}
.navy > p {
  margin: 0;
  padding: 0;
  width: auto;
  color: white;
  text-align: right;
  font-weight: bold;
  font-size: var(--fluid-type);
}

.turquise {
  composes: main;
  justify-content: flex-start;
  background-color: var(--color-turquise);
  text-align: right;
  height: auto;
}
.turquise > p {
  margin: 0;
  padding: 0;
  width: auto;
  color: var(--color-navy);
  text-align: left;
  font-weight: bold;
  font-size: var(--fluid-type);
}

.turquise > p:nth-child(2n) {
  margin-bottom: 1.5em;
}

.turquise > p:last-child {
  margin-bottom: 0;
}

.blog {
  composes: main;
  height: auto;
  padding-top: 35vh;
}

@media screen and (max-width: 700px) {
  .blog {
    padding-top: 12vh;
    padding-bottom: 8vh;
  }
}

.blog > p {
  margin: 0;
  padding: 0;
  width: auto;
  color: var(--color-light-blue);
  text-align: right;
  font-weight: bold;
  font-size: var(--fluid-type);
}

.postHeadline {
  height: auto;
  display: block;
  align-items: center;
  padding-top: var(--padding);
  padding-left: calc(calc(100% - var(--post-max-width)) / 2);
  padding-bottom: calc(var(--padding) / 2);
  background-color: var(--color-navy);
  text-align: left;
  color: var(--color-grey);
  width: 100vw;
}

.postHeadline > h1 {
  margin: 0;
  padding: 0;
  text-align: left;
  font-weight: bold;
  font-size: var(--fluid-type);
  line-height: 1.2em;
  margin-bottom: calc(var(--padding) / 12);
  max-width: var(--post-max-width);
}

.postHeadline > time {
  margin: 0;
  padding: 0;
  text-align: left;
  font-weight: bold;
  font-size: var(--fluid-type-post);
  font-style: italic;
  max-width: var(--post-max-width);
}

.post {
  height: auto;
  display: flex;
  flex-flow: column;
  padding-bottom: var(--padding);
  padding-top: calc(var(--padding) / 2);
  justify-content: center;
  align-items: flex-start;
  max-width: var(--post-max-width);
  background-color: var(--color-off-white);
  margin: 0;
}
.post > h2,
.post > h3,
.post > h4 {
  width: 75%;
  text-align: left;
  font-weight: bold;
  font-size: var(--fluid-type-h2);
  line-height: 1.2em;
}

.post > ul {
  margin: 0;
  padding: 0;
  padding-left: 5%;
  width: 75%;
  color: var(--color-navy);
  text-align: left;
  font-weight: bold;
  font-size: var(--fluid-type-post);
  font-weight: 400;
}

.post > p + ul {
  margin-top: -1em;
  margin-bottom: 1em;
}

.post > p {
  margin: 0;
  padding: 0;
  width: 100%;
  color: var(--color-navy);
  text-align: left;
  font-weight: bold;
  font-size: var(--fluid-type-post);
  font-weight: 400;
}

.post > p {
  margin-bottom: calc(var(--text-padding));
}

.post > p:last-child {
  margin-bottom: 0;
}
.post > h2 > a,
.post > h3 > a,
.post > p > a {
  color: rgb(0, 52, 89);
  text-decoration: unset;
  font-weight: 600;
}
.post > h2 > a:hover,
.post > h3 > a:hover,
.post > p > a:hover {
  text-decoration: underline;
}

.post > blockquote {
  display: block;
  border-width: 2px 0;
  border-style: solid;
  border-color: #eee;
  padding: 1.5em 0 0.5em;
  margin: 1.5em 0;
  position: relative;
  color: var(--color-navy);
  font-size: var(--fluid-type-post);
  font-weight: 400;
  font-style: italic;
}

.post > blockquote:before {
  content: "\201C";
  position: absolute;
  top: 0em;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 3rem;
  height: 2rem;
  font: 6em/1.08em "PT Sans", sans-serif;
  color: var(--color-navy);
  text-align: center;
}

.max-width {
  max-width: var(--post-max-width);
  width: -webkit-fill-available;
  margin: 0 auto;
  background-color: 'pink'
}

@media screen and (max-width: 850px) {
  .max-width {
    padding-left: var(--padding);
    padding-right: var(--padding);
  }
}

.inner {
}

.inner--indigo {
  composes: inner;
  background-color: var(--color-dark-blue);
}

.inner--navy {
  composes: inner;
  /* background-color: var(--color-dark-blue); */
  background-color: var(--color-navy);
}

.inner--turquise {
  composes: inner;
  /* background-color: var(--color-dark-blue); */
  background-color: var(--color-turquise);
}

</style>

