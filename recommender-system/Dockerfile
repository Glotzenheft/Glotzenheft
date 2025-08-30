# Basis-Image
FROM mcr.microsoft.com/azureml/minimal-ubuntu20.04-py38-cpu-inference:latest

WORKDIR /var/azureml-app

# Conda-Environment
COPY env.yml .
RUN conda env update -n azureml_py38 -f env.yml
ENV PATH=/opt/miniconda/envs/azureml_py38/bin:$PATH

# install dependencies for python environment (pip)
RUN pip install --upgrade pip && \
    pip install \
      fastapi[all] \
      pydantic \
      uvicorn[standard] \
      requests \
      pandas \
      dotenv \
      pymongo

# files
COPY score.py .
COPY knn_recs.csv .
COPY knn_content_recs.csv .
COPY movies.csv .
COPY links.csv .
COPY env.json .
COPY rootCA.pem .

# start container via azure gunicorn server with score.py file
EXPOSE 80
ENTRYPOINT ["gunicorn", "--workers", "4", \
            "--worker-class", "uvicorn.workers.UvicornWorker", \
            "--bind", "0.0.0.0:80", \
            "score:app"]