import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="article-heading" {...props} />,
    h3: (props) => <h3 className="article-subheading" {...props} />,
    a: (props) => <a className="article-link" {...props} />,
    ...components,
  };
}
