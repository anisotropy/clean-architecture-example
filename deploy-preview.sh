original_branch=$(git symbolic-ref --short HEAD)
normalized_branch=$(echo "$original_branch" | tr '/' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
alias_url="clean-architecture-example-$normalized_branch.anisotropys-projects.vercel.app"

vercel link --yes --scope anisotropys-projects --project clean-architecture-example
vercel pull --yes --environment=preview
vercel build
url="$(vercel deploy --prebuilt)"
vercel alias set "$url" "$alias_url" --scope anisotropys-projects

echo ""
echo "🚀 Preview URL: https://$alias_url"
echo ""