docker run --rm --link mongodb:mongodb --link gnuplot-service:gnuplot-service -p 8080:80 --name web web