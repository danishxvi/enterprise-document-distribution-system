# Multi stage build: compile with the full JDK, then run on a slim JRE so the
# shipped image stays small.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Resolve dependencies first so they cache across code only changes.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Run as a non root user for a smaller blast radius.
RUN useradd --system --uid 1001 spring
USER spring

COPY --from=build /app/target/edds-backend.jar app.jar

# The uploads directory should be mounted as a volume in real deployments so
# stored files survive container restarts.
ENV EDDS_STORAGE_LOCATION=/app/uploads
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
